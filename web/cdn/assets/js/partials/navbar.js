document.querySelector('.dropdown-toggle').addEventListener('click', () => {
    let dropdown = document.querySelector('.dropdown-content')
    if(dropdown.classList.contains('active')) {
        dropdown.style = 'animation: dropout .5s';
        setTimeout(() => {
            dropdown.classList.remove('active')
        }, 450)
    } else {
        dropdown.classList.add('active')
        dropdown.style = 'animation: dropin .5s';
    }
});