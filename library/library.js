var allBooks;

function load() {
    var request = new XMLHttpRequest();
    request.open("GET", "https://rsu-library-api.herokuapp.com/books", true);
    request.send();
    request.onload = function() {    
        try {
            allBooks = JSON.parse(request.responseText);
        } catch(e) {
            alert( "При загрузке произошла ошибка " + e.message );
        }
        showBooks(allBooks);
    }
}

document.addEventListener("DOMContentLoaded", load);

function createBook(a){

    var book = document.createElement('div');
    book.className = 'book';
    book.id = a.id;

    var image = document.createElement('img');
    var link = a.image_url;
    image.className = 'book__img';
    image.setAttribute('src', link);
    book.appendChild(image);

    var name = document.createElement('div');
    name.className = 'book__name';
    name.innerHTML = a.title;
    book.appendChild(name);

    var by = document.createElement('div');
    by.className = 'book__author';
    by.innerHTML = 'by ' + a.author.firstName + ' ' + a.author.lastName;
    book.appendChild(by);

    var rate = document.createElement('div');
    rate.className = 'book__rate';
    book.appendChild(rate);

    //book rating
    for (var i = 0; i < 5; i++) {
        var star = document.createElement('div');
        star.className = 'book__star';
        star.classList.add('s' + a.id);
        star.setAttribute('data-rate', i+1);
        rate.appendChild(star);
        //current rating
        if (i + 1 <= a.rating){
            star.classList.add('book__star--active', 'book__star--current');
        }
    };

    //user rating

    var rateStar = document.getElementsByClassName('s' + a.id);

    rate.addEventListener('click', rateClick);

    rate.addEventListener('mouseover', rateMouseOver);

    rate.addEventListener('mouseout', rateMouseOut);

    function rateClick(e) {
        var target = e.target;
        removeClass(rateStar, 'book__star--current');
        target.classList.add('book__star--active', 'book__star--current');

        //rating update
        if(target.dataset.rate >= 3 && a.rating < 5) {
            a.rating += 0.1;
        } 
        if(target.dataset.rate < 3 && a.rating > 0) {
            a.rating -= 0.1;
        }
    }

    function rateMouseOver(e) {
        var target = e.target;
        removeClass(rateStar, 'book__star--active');
        target.classList.add('book__star--active');
        mouseOverActive(rateStar);
    }

    function rateMouseOut() {
        addClass(rateStar, 'book__star--active');
        mouseOutActive(rateStar);
    }

    return book;
}

function removeClass(arr) {
    for(var i = 0; i < arr.length; i++) {
        for(var j = 1; j < arguments.length; j++) {
            arr[i].classList.remove(arguments[j]);
        }
    }
}

function addClass(arr) {
    for(var i = 0; i < arr.length; i++) {
        for(var j = 1; j < arguments.length; j++) {
            arr[i].classList.add(arguments[j]);
        }
    }
}

function mouseOverActive(arr) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i].classList.contains('book__star--active')) {
            break;
        } else {
            arr[i].classList.add('book__star--active');
        }
    }
}

function mouseOutActive(arr) {
    for(var i = arr.length-1; i >= 0; i--) {
        if(arr[i].classList.contains('book__star--current')) {
            break;
        } else {
            arr[i].classList.remove('book__star--active');
        }
    }
}

function showBooks(arr) {
    var library = document.querySelector('.library');
    library.innerHTML = '';

    arr.forEach(function(a){
    var book = createBook(a);
    library.appendChild(book);
    });
}

//adding a new book
var addButton = document.getElementsByClassName('add__btn')[0];
addButton.addEventListener('click', bookAdd);

function bookAdd() {

    var formWrapper = document.createElement('div');
    formWrapper.className = 'form-wrapper';
    document.body.appendChild(formWrapper);

    var closeBtn = document.createElement('div');
    closeBtn.className = 'form-close';
    formWrapper.appendChild(closeBtn);

    var form = document.createElement('form');
    form.id = 'book-add';
    form.setAttribute('action', '#');
    formWrapper.appendChild(form);

    var bookImg = document.createElement('div');
    bookImg.innerHTML = 'Book cover (URL): ';
    form.appendChild(bookImg);

    var imgInput = document.createElement('input');
    imgInput.setAttribute('type', 'url');
    form.appendChild(imgInput);

    var bookTitle = document.createElement('div');
    bookTitle.innerHTML = 'Title: ';
    form.appendChild(bookTitle);

    var titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('required', '');
    form.appendChild(titleInput);

    var bookAuthor = document.createElement('div');
    bookAuthor.innerHTML = 'Author: ';
    form.appendChild(bookAuthor);

    var authorInput = document.createElement('input');
    authorInput.setAttribute('type', 'text');
    authorInput.setAttribute('required', '');
    form.appendChild(authorInput);

    var bookRate = document.createElement('div');
    bookRate.innerHTML = 'Rate: ';
    form.appendChild(bookRate);

    var rateInput = document.createElement('input');
    rateInput.setAttribute('type', 'number');
    rateInput.setAttribute('min', '0');
    rateInput.setAttribute('max', '5');
    rateInput.setAttribute('required', '');
    form.appendChild(rateInput);

    var bookPrice = document.createElement('div');
    bookPrice.innerHTML = 'Price: ';
    form.appendChild(bookPrice);	

    var priceInput = document.createElement('input');
    priceInput.setAttribute('type', 'number');
    priceInput.setAttribute('required', '');
    form.appendChild(priceInput);

    var submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', 'Add Book');
    form.appendChild(submit);

    closeBtn.addEventListener('click', function() {
        document.body.removeChild(formWrapper);
    });

    form.addEventListener('submit', pushBook);

    function pushBook() {
        var book = { 
            title: titleInput.value, 
            author: {
            firstName: authorInput.value.split(' ')[0] || '',
            lastName: authorInput.value.split(' ')[1] || ''
            },
            createdAt: new Date().getTime(),
            image_url: imgInput.value || "https://rsu-library-api.herokuapp.com/static/images/nocover.jpg",
            rating: rateInput.value,   
            cost: priceInput.value
        }
        allBooks.push(book);
        showBooks(allBooks);

        //adding a new book to actions
        var actions = document.querySelector('.sidebar-actions');		
        var newAction = document.createElement('li');
        newAction.className = 'sidebar-actions__item';

        actions.insertBefore(newAction, actions.firstChild);

        newAction.insertAdjacentHTML('afterBegin', 'You added <span class="sidebar-actions__item--bright">' +
        titleInput.value + 
        '</span> by <span class="sidebar-actions__item--bright">' +
        authorInput.value + 
        '</span> to your <span class="sidebar-actions__item--bright"> Must Read Titles.</span><p class="sidebar-actions__time">1 minute ago</p>'
        );

        document.body.removeChild(formWrapper);
    }
}

//books filter
var filter = document.querySelector(".filter");

filter.addEventListener('click', bookFilter);

function bookFilter(e) {
    var target = e.target;
    var filterItem = document.querySelectorAll('.filter__item');

    //setting active class
    for (var i = 0; i < 4; i++) {
        if (filterItem[i] === target) {
            filterItem[i].classList.add('filter__item--active');
        } else {
            filterItem[i].classList.remove('filter__item--active');
        }
    }

    //book filtering
    switch(target) {
        case filterItem[0]:
            showBooks(allBooks);
            break;

        case filterItem[1]:
            var recent = allBooks.slice();
            recent.sort(function(a, b){
                if(a.createdAt < b.createdAt){
                return 1;
            }
                return -1;
            });
            showBooks(recent);
            break;

        case filterItem[2]:
            var popular = allBooks.slice();
            popular.sort(function(a, b){
                if(a.rating < b.rating){
                return 1;
            }
                return -1;
            });
            showBooks(popular);
            break;

        case filterItem[3]:
            var free = allBooks.filter(function(item){
                return item.cost == 0
            });
            showBooks(free);
    }
}

//book search
var bookSearch = document.querySelector(".filter-search");

bookSearch.addEventListener('input', function(e) {
    var value = e.target.value.toLowerCase();
    var foundBooks = allBooks.filter(function(item){ 
        return item.title.toLowerCase().indexOf(value) !== -1;
    });
    showBooks(foundBooks);
});