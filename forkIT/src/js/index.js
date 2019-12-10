// Global app controller
import Search from './models/Search';
import { elements, renderLoader, deleteLoader } from './views/base';
import * as searchView from './views/searchView';

import Recipe from './models/Recipe';

// State
const state = {};




//////////////////////
//Search controller///
//////////////////////
const controlSearch = async () => {
    // 1. Get the query
    const query = searchView.getInput();

    if (query) {
        // 2. New search object add to state
        state.search = new Search(query);

        // 3. Prepare the UI for results
        renderLoader(elements.searchResults);
        searchView.clearInput();
        searchView.clearResults();

        try {
        // 4. Search for recipe
        await state.search.getResults();

        // 5. Render results on UI
        deleteLoader();
        searchView.renderResults(state.search.result);
        } catch(error) {
            alert(error);
        }

    }
}

// Adding event listener to search button
elements.searchBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
})

// Adding event listener to pagination buttons
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})


//////////////////////
//Recipe controller///
//////////////////////

const controlRecipe = async () => {

    // Get id from URL
    const id = window.location.hash.replace('#', '');
    console.log(id);


    if (id) {

        // Prepare UI for changes


        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate serving time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            console.log(state.recipe);
        } catch (error) {
            alert(error);
        }
    }


}

window.addEventListener('hashchange', controlRecipe);

['hashchange', 'load'].forEach((event) => {
    window.addEventListener(event, controlRecipe);
})