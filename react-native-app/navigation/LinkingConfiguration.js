import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    Root: {
      path: 'root',
      screens: {
        Home: 'home',
        SignIn: 'signin',
        SignUp: 'signup',
        Links: 'links',
        Workouts: 'workouts',
        SingleWorkout: 'workout',
      },
    },
  },
};
