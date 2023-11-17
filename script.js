

function searchAmazon() {
    // consts to get the information typed in the inputs.
    const asin = document.getElementById('asinInput').value;
    const keyword = document.getElementById('keywordInput').value;
  //
    if (!asin || asin.length !== 10 || !keyword) {
        Toastify({
            text: 'Please enter a valid ASIN and Keyword.',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'center',
            backgroundColor: 'red',
        }).showToast();
        return;
    }
  
    fetch(`http://localhost:8080/search?asin=${asin}&keyword=${encodeURIComponent(keyword)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data received from server:', data);
        const resultElement = document.getElementById('result');
        if (data.position !== undefined && data.position !== -1) {
            Toastify({
                text: 'Success!!!',
                close: true,
                gravity: 'top',
                position: 'center',
                backgroundColor: 'green',
            }).showToast();
          resultElement.innerText = `Product Position: ${data.position}`;
        } else {
          resultElement.innerText = 'Product not found in the first 5 pages.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'An error occurred during the search.';
      });
  }
  