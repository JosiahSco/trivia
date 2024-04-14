export const Category = {
    GeneralKnowledge: '9',
    EntertainmentBooks: '10',
    EntertainmentFilm: '11',
    EntertainmentMusic: '12',
    EntertainmentMusicals: '13',
    EntertainmentTV: '14',
    EntertainmentVideoGames: '15',
    EntertainmentBoardGames: '16',
    ScienceNature: '17',
    ScienceComputers: '18',
    ScienceMathematics: '19',
    Mythology: '20',
    Sports: '21',
    Geography: '22',
    History: '23',
    Politics: '24',
    Art: '25',
    Celebrities: '26',
    Animals: '27',
    Vehicles: '28',
    EntertainmentComics: '29',
    ScienceGadgets: '30',
    EntertainmentJapaneseAnime: '31',
    EntertainmentCartoon: '32',
};

// Accepts number of questions a list of categories as strings
export async function fetchQuestion(enabledCategories, difficulties) {
    const categoryIds = enabledCategories.map(category => Category[category]);

    let randomCategory = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    let randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const response = await fetch(`https://opentdb.com/api.php?amount=1&category=${randomCategory}&difficulty=${randomDifficulty}&type=multiple`);
    const questionData = await response.json();
    console.log(questionData);
    return questionData.results[0];
}

// export async function fetchCategories() { 
//     const response = await fetch('https://opentdb.com/api_category.php');
//     const data = await response.json();
//     return data.trivia_categories;
// }