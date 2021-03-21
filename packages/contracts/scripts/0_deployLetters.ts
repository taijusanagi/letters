import { deployLetters } from "../helpers/migrations";

deployLetters()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
