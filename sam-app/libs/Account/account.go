package Account

import (
	"../Database"
	"database/sql"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"log"
	"math/rand"
	"strconv"
	"time"
)

type User struct {
	Firstname string `json:"firstname"`
	Lastname string `json:"lastname"`
	Email string `json:"email"`
}

func Exists(email string) bool {
	db := Database.Connect()

	var amount sql.NullInt64
	err := db.QueryRow("SELECT COUNT(`id`) FROM users WHERE email = '" + email + "'").Scan(&amount)

	if err != nil {
		panic(err)
	}

	defer db.Close()

	if amount.Valid {
		return amount.Int64 > 0
	}

	return false
}

func SignUp(email string, password string) (string, error) {
	db := Database.Connect()

	stmt, err := db.Prepare("INSERT users SET email=?, password=?")
	if err != nil {
		return "", err
	}
	defer stmt.Close()

	hashedPasswordBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	hashedPassword := string(hashedPasswordBytes)

	res, err := stmt.Exec(email, hashedPassword)
	if err != nil {
		return "", err
	}

	insertedId, err := res.LastInsertId()
	if err != nil {
		return "", err
	}

	return setActionKey(int(insertedId))
}

func SignIn(email string, password string) (string, error) {

	db := Database.Connect()

	bytePassword := []byte(password)

	var id int
	var pwd string
	err := db.QueryRow("SELECT id, password FROM users WHERE email=?", email).Scan(&id, &pwd)
	if err != nil {
		return "", err
	}

	existingHashedPassword := []byte(pwd)

	// Comparing the password with the hash
	err = bcrypt.CompareHashAndPassword(existingHashedPassword, bytePassword)

	if err != nil {
		return "", errors.New("wrong credentials")
	} else {
		return setActionKey(id)
	}
}

func randomString(id int) string {
	var letters = []rune(strconv.Itoa(id) + "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	actionKey := make([]rune, 50)
	for i := range actionKey {
		actionKey[i] = letters[rand.Intn(len(letters))]
	}

	return string(actionKey)
}

func setActionKey(id int) (string, error) {
	db := Database.Connect()

	updateAction, err := db.Prepare("UPDATE users SET action_key=?, last_action_time=? WHERE id=?")
	if err != nil {
		return "", errors.New("something went wrong when preparing update of action key")
	}

	actionKey := randomString(id)

	currentTime := time.Now().String()
	currentTimeString := currentTime[0:19]

	log.Println("UPDATE users SET action_key=" + string(actionKey) + ", last_action_time=" + currentTimeString + " WHERE id=" + strconv.Itoa(id))
	_, err = updateAction.Exec(string(actionKey), currentTimeString, id)
	if err != nil {
		return "", errors.New("something went wrong when updating the action key")
	}

	return actionKey, nil
}

func Action(actionKey string) (string, error) {
	db := Database.Connect()

	updateAction, err := db.Prepare("UPDATE users SET last_action_time=? WHERE id=?")
	if err != nil {
		return actionKey, errors.New("something went wrong when preparing update of action key")
	}

	currentTime := time.Now().String()
	currentTimeString := currentTime[0:19]

	log.Println("UPDATE users SET last_action_time=" + currentTimeString + " WHERE action_key=" + actionKey)
	_, err = updateAction.Exec(currentTimeString, actionKey)
	if err != nil {
		return actionKey, errors.New("something went wrong when updating the action key")
	}

	return actionKey, nil
}

func Info(actionKey string) (User, error) {
	db := Database.Connect()

	var user User
	var email string
	var firstname sql.NullString
	var lastname sql.NullString

	err := db.QueryRow("SELECT firstname, lastname, email FROM users WHERE action_key=?", actionKey).Scan(&firstname, &lastname, &email)
	if err != nil {
		return user, err
	}

	if firstname.Valid {
		user.Firstname = firstname.String
	}
	if lastname.Valid {
		user.Lastname = lastname.String
	}
	user.Email = email

	return user, nil
}