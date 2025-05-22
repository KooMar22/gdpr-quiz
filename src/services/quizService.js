import supabase from "./supabaseConfig";

const fetchQuizQuestions = async () => {
  try {
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, text")
      .order("id");

    if (questionsError) throw questionsError;

    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const { data: answers, error: answersError } = await supabase
          .from("answers")
          .select("id, text, is_correct")
          .eq("question_id", question.id);

        if (answersError) throw answersError;

        return {
          ...question,
          answers: answers.map(answer => ({
            id: answer.id,
            text: answer.text,
            isCorrect: answer.is_correct
          }))
        };
      })
    );

    return questionsWithAnswers;
  } catch (error) {
    console.error(`Error fetching quiz questions: ${error}`);
    throw new Error("Ne mogu dohvatiti pitanja kviza");
  }
};

const saveQuizResults = async (results) => {
  try {
    const { data: quizResult, error: quizError } = await supabase
      .from("quiz_results")
      .insert([
        { 
          score: results.score, 
          total_questions: results.totalQuestions 
        }
      ])
      .select();

    if (quizError) throw quizError;

    const quizResultId = quizResult[0].id;
    
    const userAnswers = results.answers.map(answer => ({
      quiz_result_id: quizResultId,
      question_id: answer.questionId,
      answer_id: answer.answerId
    }));

    const { error: answersError } = await supabase
      .from("user_answers")
      .insert(userAnswers);

    if (answersError) throw answersError;

    return { success: true, quizResultId };
  } catch (error) {
    console.error(`Error saving quiz results: ${error}`);
    throw new Error("Ne mogu spremiti rezultate kviza");
  }
};

export default {fetchQuizQuestions, saveQuizResults};