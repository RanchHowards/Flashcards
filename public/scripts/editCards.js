$(document).ready(() => {

    // $('.front').on('click', 'button', function(event) { //WASTED SO MUCH TIME BECUASE OF A FUCKING ARROW FUNCTION & 'THIS' SCOPE!!!!!!
    //     event.stopPropagation();

    //     updateFront($(this));
    // })

    // $('.back').on('click', 'button', function(event) {
    //     event.stopPropagation();
    //     updateBack($(this));
    // })
    $('.btn-success').click(function (event) {
        event.stopPropagation();
        updateBoth($(this));
    })
    $('.btn-danger').click(function (event) {
        event.stopPropagation();
        deleteCards($(this));
    })
})
function updateBoth(button) {

    let oldPath = $(button).attr('id');
    let newPath = $(button).siblings('.front').find('input').attr('name') + $(button).siblings('.front').find('input').val(); //need to double check where these go
    let newValue = $(button).siblings('.back').find('input').val();
    $.ajax({
        url: '/editcards',
        type: 'PUT',
        data: { oldPath, newPath, newValue },
        success: function (data) {
            console.log('SAVED TO DB BOTH!', data);
        }

    })
}
function deleteCards(button) {
    let oldPath = $(button).prev().attr('id');
    let deleteCard = true;
    let el = $(button).closest('.card-group');
    $.ajax({
        url: '/editcards',
        type: 'PUT',
        data: { oldPath, deleteCard },
        success: function (data) {
            console.log('Card has been deleted');

        }
    });
    deleteAnimation(el);

}
function deleteAnimation(el) {
    el.animate({ opacity: 0 }, 150, function () {
        el.animate({ height: '0px' }, 150, function () {
            el.remove()
        })
    })
}
// function updateFront(button) {
//     let oldName = $(button).attr('id');
//     let newName = $(button).prev().attr('name') + $(button).prev().val();
//     $.ajax({
//         url: '/addcards/editfront',
//         type: 'PUT',
//         data: { oldName, newName },
//         // contentType: 'application/json',     
//         success: function (data) {
//             console.log('saved to DB FRONT');
//         }
//     })
// }

// function updateBack(button) {
//     let nestedPath = $(button).attr('id');
//     let newName = $(button).prev().val();
//     $.ajax({
//         url: '/addcards/editback',
//         type: 'PUT',
//         data: { nestedPath, newName },
//         // contentType: 'application/json',     
//         success: function (data) {
//             console.log('saved to DB, BACK');
//         }
//     })
// }