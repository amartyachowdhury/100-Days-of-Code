from data import fetch_question_data
from question_model import Question
from quiz_brain import QuizBrain
from ui import QuizInterface


def build_question_bank():
    question_bank = []
    for question in fetch_question_data():
        question_bank.append(
            Question(question["question"], question["correct_answer"])
        )
    return question_bank


def main():
    quiz = QuizBrain(build_question_bank())
    QuizInterface(quiz)


if __name__ == "__main__":
    main()
