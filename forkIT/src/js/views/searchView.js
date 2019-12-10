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
    elements.searchResultsList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
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
        <a class="results__link results__link" href="#${recipe.recipe_id}">
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

// Creating the buttons
const createButton = (page, type) => `

                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
                `;


// Rendering the buttons on page
const renderButtons = (page, numResults, resPerPage) => {

    // Total pages number
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        // Display button to go NEXT
        button = createButton(page, 'next');

    } else if (page < pages) {
        // Display NEXT nad PREV
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    }

    else if (page === pages && pages > 1) {
        // Display button to go PREV
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

// 1Rendering recipes array
export const renderResults = (recipes, page = 1, resPerPage = 10) => {

    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(el => renderRecipe(el));

    renderButtons(page, recipes.length, resPerPage);
}