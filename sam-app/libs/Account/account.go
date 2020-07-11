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

func SignUp(email string, password string) (int64, error) {
	db := Database.Connect()

	stmt, err := db.Prepare("INSERT users SET email=?, password=?")
	if err != nil {
		return -1, err
	}
	defer stmt.Close()

	hashedPasswordBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	hashedPassword := string(hashedPasswordBytes)

	res, err := stmt.Exec(email, hashedPassword)
	if err != nil {
		return -1, err
	}

	insertedId, err := res.LastInsertId()

	return insertedId, err
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
		updateAction, err := db.Prepare("UPDATE users SET action_key=?, last_action_time=? WHERE id=?")
		if err != nil {
			return "", err
		}

		var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

		actionKey := make([]rune, 50)
		for i := range actionKey {
			actionKey[i] = letters[rand.Intn(len(letters))]
		}
		log.Println(string(actionKey))

		log.Println(id)

		currentTime := time.Now().String()
		currentTimeString := currentTime[0:19]

		log.Println("UPDATE users SET action_key=" + string(actionKey) + ", last_action_time=" + currentTimeString + " WHERE id=" + strconv.Itoa(id))
		_, err = updateAction.Exec(string(actionKey), currentTimeString, id)
		if err != nil {
			return "", err
		}

		return string(actionKey), nil
	}
}