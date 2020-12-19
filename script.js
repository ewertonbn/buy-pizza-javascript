const selector = (el) => document.querySelector(el);
const selectorAll = (el) => document.querySelectorAll(el);
let modalQt = 1;
let cart = [];
let modalKey = 0;

pizzaJson.map( (item, index) => {
  
  let pizzaItem = selector('.models .pizza-item').cloneNode(true);

  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    // target = clica no próprio elemento | closest = busca o elemento mais próxima, no caso, pizza-item.
    // identificador da pizza clicada
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;
    
    selector('.pizzaBig img').src = pizzaJson[key].img;
    selector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    selector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    selector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
    selector('.pizzaInfo--size.selected').classList.remove('selected');
    selectorAll('.pizzaInfo--size').forEach(( size, sizeIndex ) => {
      if( sizeIndex == 2 ) {
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
    
    selector('.pizzaInfo--qt').innerHTML = modalQt;

    selector('.pizzaWindowArea').style.opacity = 0;
    selector('.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => {
      selector('.pizzaWindowArea').style.opacity = 1;
    }, 200);
  });

  selector('.pizza-area').append( pizzaItem );

} );

// Eventos do MODAL
// Fechar modal
function closeModal() {
  selector('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    selector('.pizzaWindowArea').style.display = 'none';
  }, 500);
}
selectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
  item.addEventListener('click', closeModal);
});

// Botão de aumentar e diminuir quantidade
selector('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if( modalQt > 1 ) {
    modalQt--;
    selector('.pizzaInfo--qt').innerHTML = modalQt;
  }
});
selector('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQt++;
  selector('.pizzaInfo--qt').innerHTML = modalQt;
});

// Botão de tamanho da pizza
selectorAll('.pizzaInfo--size').forEach(( size, sizeIndex ) => {
  size.addEventListener('click', (e) => {
    selector('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

// Botão adicionar ao carrinho
selector('.pizzaInfo--addButton').addEventListener('click', () => {
  let size = parseInt(selector('.pizzaInfo--size.selected').getAttribute('data-key'));

  // Identificador do produto e opção esclhida
  let identifier = pizzaJson[modalKey].id + '@' + size;
  // Verifica no carrinho se a opção escolhida já existe com base no identificador
  let key = cart.findIndex((item) => item.identifier == identifier);

  // se a opção for encontrada, atualizada a quantidade no mesmo item, se não, adiciona um novo
  if(key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt
    });
  }

  updateCart();
  closeModal();
});

// Menu Mobile
selector('.menu-openner').addEventListener('click', () => {
  if(cart.length > 0) {
    selector('aside').style.left = '0';
  }
});
selector('.menu-closer').addEventListener('click', () => {
  selector('aside').style.left = '100vw';
});

// Função de atualizar o carrinho
function updateCart() {
  selector('.menu-openner span').innerHTML = cart.length;

  if( cart.length > 0 ) {
    selector('aside').classList.add('show');
    selector('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    // Retorna informações da pizza selecionada
    for(let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;

      let cartItem = selector('.models .cart--item').cloneNode(true);

      let pizzaSizeName;
      switch(cart[i].size) {
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if(cart[i].qt > 1) {
          cart[i].qt--;
        } else {
          cart.splice(i, 1);
        }
        updateCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qt++;
        updateCart();
      });

      selector('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    console.log(subtotal, desconto, total);

    selector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    selector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    selector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

  } else {
    selector('aside').classList.remove('show');
    selector('aside').style.left = '100vw';
  }

}