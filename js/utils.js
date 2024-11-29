export function insertHtml(html, nomId = null) {
    if (nomId === null)  nomId = html
    
    fetch(`/components/${html}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(nomId);
            element ? element.innerHTML = data : null;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
