import supabase from "./supabaseConfig";

const getStatistics = async () => {
  try {
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, text")
      .order("id", { ascending: true });

    if (questionsError) throw questionsError;

    const questionStats = await Promise.all(
      questions.map(async (question) => {
        const { data: answers, error: answersError } = await supabase
          .from("answers")
          .select("id, text, is_correct")
          .eq("question_id", question.id);

        if (answersError) throw answersError;

        const answerStats = await Promise.all(
          answers.map(async (answer) => {
            const { count, error: countError } = await supabase
              .from("user_answers")
              .select("*", { count: "exact", head: true })
              .eq("answer_id", answer.id);

            if (countError) throw countError;

            return {
              id: answer.id,
              text: answer.text,
              isCorrect: answer.is_correct,
              count: count || 0
            };
          })
        );

        const totalAnswers = answerStats.reduce((sum, stat) => sum + stat.count, 0);

        return {
          questionId: question.id,
          questionText: question.text,
          totalAnswers,
          answers: answerStats
        };
      })
    );

    const { data: results, error: resultsError } = await supabase
      .from("quiz_results")
      .select("score, total_questions");

    if (resultsError) throw resultsError;

    const totalQuizzes = results.length;
    const averageScore = totalQuizzes > 0
      ? results.reduce((sum, result) => sum + (result.score / result.total_questions * 100), 0) / totalQuizzes
      : 0;
    const highestScore = results.length > 0
      ? Math.max(...results.map(result => (result.score / result.total_questions * 100)))
      : 0;

    return {
      questionStats,
      overall: {
        totalQuizzes,
        averageScore,
        highestScore
      }
    };
  } catch (error) {
    console.error(`Error fetching statistics: ${error}`);
    throw new Error("Ne mogu dohvatiti statistiku");
  }
};

export default getStatistics;