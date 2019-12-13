// All DOM elements
export const elements = {
    searchBtn: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultsList: document.querySelector('.results__list'),
    searchResults: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

export const elementStrings = {
    loader: 'loader'
}

// Making loader spinner
export const renderLoader = (parent) => {
    const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
}

// Deleting loader
export const deleteLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) {
        loader.parentElement.removeChild(loader);
    }
}

