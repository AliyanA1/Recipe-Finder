import { useEffect, useState } from "react";

// Custom CSS for the loading spinner and description styling
const styles = `
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #F5A623;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .description {
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #FF6B6B #FFF3D1;
  }

  .description::-webkit-scrollbar {
    width: 6px;
  }

  .description::-webkit-scrollbar-track {
    background: #FFF3D1;
  }

  .description::-webkit-scrollbar-thumb {
    background-color: #FF6B6B;
    border-radius: 10px;
  }
`;

const App = () => {
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState([]);
  const [recipeName, setRecipeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({}); 

  useEffect(() => {
    const fetchapi = async () => {
      if (!recipeName.trim()) {
        setRecipe([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`
        );
        if (!response.ok) throw new Error("Error fetching data");

        const data = await response.json();
        setRecipe(data.meals || []);
        setError("");
      } catch (error) {
        setError(`Invalid: ${error.message}`);
      }
      setLoading(false);
    };
    fetchapi();
  }, [recipeName]);

  // Toggle function for expanding/collapsing descriptions
  const toggleDescription = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#ffe8b3] text-[#333] flex flex-col items-center py-10 px-4">
      {/* Inject custom styles */}
      <style>{styles}</style>

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-[#FF6B6B] mb-8 font-['Poppins']">
        🍽️ Recipe Book
      </h1>

      {/* Search Input Area */}
      <div className="bg-[#FFF3D1] p-6 rounded-2xl shadow-lg w-full max-w-lg flex flex-col gap-4">
        <input
          className="w-full p-3 bg-white text-[#333] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] placeholder-gray-400"
          type="text"
          placeholder="Search for a recipe..."
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
        />
      </div>

      {/* Error, Loading, and No Results States */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading && (
        <div className="mt-6 flex flex-col items-center">
          <div className="spinner"></div>
          <p className="text-[#F5A623] mt-2 text-lg">Loading...</p>
        </div>
      )}
      {!loading && recipe.length === 0 && recipeName && (
        <p className="text-[#FF6B6B] mt-6 text-lg">No recipe found for "{recipeName}"</p>
      )}

      {/* Recipe List */}
      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {recipe.map((val) => {
          const isExpanded = expanded[val.idMeal];
          const description = val.strInstructions;
          const isLongDescription = description.length > 300; // Consider descriptions over 300 chars as "long"

          return (
            <li
              key={val.idMeal}
              className="bg-white p-5 rounded-2xl shadow-lg transition transform hover:scale-105 hover:bg-gray-50"
            >
              <h3 className="text-2xl font-semibold text-[#FF6B6B]">{val.strMeal}</h3>
              <img
                src={val.strMealThumb}
                alt={val.strMeal}
                className="w-full h-48 object-cover rounded-lg mt-4 shadow-md"
              />
              <p className="text-gray-600 mt-2">
                <strong>Category:</strong> {val.strCategory}
              </p>
              <p className="text-gray-600">
                <strong>Origin:</strong> {val.strArea}
              </p>
              <div className="mt-3">
                <p
                  className={`text-gray-500 text-sm leading-relaxed ${
                    isLongDescription && !isExpanded ? "line-clamp-3" : ""
                  } description`}
                >
                  {description}
                </p>
                {isLongDescription && (
                  <button
                    onClick={() => toggleDescription(val.idMeal)}
                    className="text-[#FF6B6B] text-sm mt-2 hover:underline focus:outline-none"
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <footer className="mt-10 text-gray-500 text-sm">
        made with ❤️ by AliyanA1
      </footer>
    </div>
  );
};

export default App;