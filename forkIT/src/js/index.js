// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List'
import Likes from './models/Likes'

import { elements, renderLoader, deleteLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


// State
const state = {};
window.state = state;



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
            console.log(error);
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

    if (id) {

        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected recipe
        if (state.search) {
            searchView.highlightSelected(id);
        }
        

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
            deleteLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            console.log(error);
        }
    }


}


//////////////////////
//List controller/////
//////////////////////

const controlList = () => {

    // Create new list
    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredients to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item);
    });

}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
        
        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});

//////////////////////
//Like controller/////
//////////////////////


//TESTING
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes())


const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }

    const currentID = state.recipe.id;
    
    // User has NOT liked yet current recipe
    if (!state.likes.isLiked(currentID)) {

        // Add like to the state
        const newLike = state.likes.addLikes(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
            likesView.toggleLikeBtn(true);

        // Add like to the UI list
        likesView.renderLike(newLike)
        console.log(state.likes)
    
    // User HAS liked current recipe
    } else {
        // Remove like to the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from the UI list
        likesView.deleteLike(currentID);
        console.log(state.likes)

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}


window.addEventListener('hashchange', controlRecipe);

['hashchange', 'load'].forEach((event) => {
    window.addEventListener(event, controlRecipe);
})

// Adding event listeners to increse and descrese buttons at servings
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {

        // Decrease button is clicked 
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {

        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredient to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
}) 

window.l = new List();