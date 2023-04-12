const userCardTemplate = document.querySelector('[data-user-template]');
const userCardListTemplate = document.querySelector('[data-user-list-template]');
const userCards = document.querySelector('.user-cards');
const inputValue = document.querySelector('#search');
const list = document.querySelector('.list')
let arr = [];

async function getRepo() {
    userCards.replaceChildren();
    if (inputValue.value.length !== 0) {
        return await fetch(`https://api.github.com/search/repositories?q=${inputValue.value}&order=desc&per_page=5`)
            .then(data => data.json())
            .then(res => res.items).then(res => res.map(el => {
                const card = userCardTemplate.content.cloneNode(true).children[0];
                const header = card.querySelector('[data-header]')
                header.textContent = el.full_name
                userCards.appendChild(card)
                arr.push(el);
            }))
    }
}
function debounce(func, timeout) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
userCards.addEventListener('click', e => {
    let target = e.target.textContent;
    arr.forEach(el => {
        if (el.full_name === target) {
            const card = userCardListTemplate.content.cloneNode(true).children[0];
            const header = card.querySelector('[data-header]')
            const user = card.querySelector('[data-user]')
            const stars = card.querySelector('[data-stars]')
            const deleteBtn = card.querySelector('[data-delete]')
            header.textContent = `Name: ${el.name}`
            user.textContent = `Owner: ${el.owner.login}`
            stars.textContent = `Stars: ${el.stargazers_count}`
            list.appendChild(card)
            deleteBtn.addEventListener('click', function f() {
                list.removeChild(card)
                deleteBtn.removeEventListener('click', f);
            })
        }
        inputValue.value = null;
        userCards.replaceChildren();
    })
    arr = [];
})
const func = debounce(getRepo, 600);
inputValue.addEventListener('input', func);
