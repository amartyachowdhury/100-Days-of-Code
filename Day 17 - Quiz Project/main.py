from data import question_data
from question_model import Question
from quiz_brain import QuizBrain


def build_question_bank():
    question_bank = []
    for question in question_data:
        new_question = Question(question["question"], question["correct_answer"])
        question_bank.append(new_question)
    return question_bank


def read_play_again():
    while True:
        choice = input("Play again? Type 'y' or 'n': ").lower()
        if choice == "y":
            return True
        if choice == "n":
            return False
        print("Please type 'y' or 'n'.")


def run_quiz():
    quiz = QuizBrain(build_question_bank())

    while quiz.still_has_questions():
        quiz.next_question()

    print("You've completed the quiz")
    print(f"Your final score was: {quiz.score}/{quiz.question_number}")


def main():
    while True:
        run_quiz()
        if not read_play_again():
            print("Goodbye!")
            break
        print("\n" * 20)


if __name__ == "__main__":
    main()
