import { useState, useEffect, useMemo } from "react";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from "recharts";
import getStatistics from "../../services/statisticsService";

const Statistics = () => {
  const [statistics, setStatistics] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatistics((prev) => ({ ...prev, loading: true, error: null }));
        const data = await getStatistics();
        setStatistics({ loading: false, error: null, data });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setStatistics({
          loading: false,
          error: error.message || "Greška pri dohvaćanju statistike",
          data: null,
        });
      }
    };

    fetchStatistics();
  }, []);

  const formattedData = useMemo(() => {
    if (!statistics.data?.questionStats) return [];

    return statistics.data.questionStats.map((stat) => ({
      questionId: stat.questionId,
      questionText: stat.questionText,
      totalAnswers: stat.totalAnswers,
      answerDistribution: stat.answers.map((answer) => ({
        name: answer.text,
        value: answer.count,
        isCorrect: answer.isCorrect,
      })),
    }));
  }, [statistics.data]);

  const overallStats = useMemo(() => {
    if (!statistics.data?.overall) return null;

    const { overall } = statistics.data;
    return {
      totalQuizzes: overall.totalQuizzes || 0,
      averageScore: Number(overall.averageScore || 0).toFixed(2),
      highestScore: Number(overall.highestScore || 0).toFixed(0),
    };
  }, [statistics.data]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (statistics.loading) {
    return (
      <div className="statistics">
        <h1>Učitavanje statistike...</h1>
      </div>
    );
  }

  if (statistics.error) {
    return (
      <div className="statistics">
        <h1>Greška pri učitavanju statistike</h1>
        <p>{statistics.error}</p>
        <button
          className="btn"
          onClick={() => window.location.reload()}
          style={{ marginTop: "1rem" }}
        >
          Pokušaj ponovo
        </button>
      </div>
    );
  }

  if (!statistics.data || formattedData.length === 0) {
    return (
      <div className="statistics">
        <h1>Statistika</h1>
        <p>Trenutno nema dostupnih podataka za statistiku.</p>
        <p>Završite kviz kako biste pridonijeli statistici.</p>
      </div>
    );
  }

  return (
    <div className="statistics">
      <h1>Statistika GDPR Kviza</h1>

      {overallStats && (
        <div className="overall-stats">
          <h2>Ukupna statistika</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Ukupno riješenih kvizova:</span>
              <span className="stat-value">{overallStats.totalQuizzes}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Prosječan rezultat:</span>
              <span className="stat-value">{overallStats.averageScore}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Najviši rezultat:</span>
              <span className="stat-value">{overallStats.highestScore}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="questions-stats">
        <h2>Statistika po pitanjima</h2>
        {formattedData.map((questionData, index) => (
          <div key={questionData.questionId} className="question-stat">
            <h3>
              Pitanje {index + 1}: {questionData.questionText}
            </h3>
            <p>Ukupno odgovora: {questionData.totalAnswers}</p>

            {questionData.totalAnswers > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={questionData.answerDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {questionData.answerDistribution.map(
                        (entry, entryIndex) => (
                          <Cell
                            key={`cell-${entryIndex}`}
                            fill={
                              entry.isCorrect
                                ? "#4CAF50"
                                : COLORS[entryIndex % COLORS.length]
                            }
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `${value} odgovora`,
                        "Broj odgovora",
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p style={{ fontStyle: "italic", color: "#666" }}>
                Nema podataka za prikaz
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;