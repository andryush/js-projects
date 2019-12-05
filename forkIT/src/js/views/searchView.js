import { elements } from './base';

// Get input from search field
export const getInput = () => {
    return elements.searchInput.value;
}

// Clear input after pressing search
export const clearInput = () => {
    return elements.searchInput.value = '';
}

// Clear list for second search
export const clearResults = () => {
    return elements.searchResultsList.innerHTML = '';
}

// Cutting titles if they are too long
const limitTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length < limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

// 2Rendering recipes one by one
const renderRecipe = (recipe) => {
    const markup = `
    <li>
        <a class="results__link results__link--active" href="${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
`;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);

}

// 1Rendering recipes array
export const renderResults = (recipes) => {

    recipes.forEach(el => renderRecipe(el));
}