const[,,method, route,...args] = process.argv;
if (!method || !route) {
    console.error('Usage: node Proyecto/index.js GET posts/5');
    process.exit(1);
}
const[resource, id] = route.split('/').filter(Boolean);
const BASE_URL = "https://fakestoreapi.com/";
const req = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
};

if(method === 'GET') {
    if(id) {
       const data = await req(`${BASE_URL}/${resource}/${id}`);
       console.log(data);
    }else{
        const data = await req(`${BASE_URL}/${resource}`);
        console.log(data); 
    }
} else if(method === 'POST') {
    const response = await fetch(`${BASE_URL}/${resource}`);
    if (!response.ok) {
       throw new Error(`Error HTTP: ${response.status}`);
    }
    const [title, price, category] = args;
    console.log('Creating new product:');
    console.log(`Title: ${title}`);
    console.log(`Price: $${Number(price).toLocaleString('es-AR')}`);
    console.log(`Category: ${category}`);
} else if(method === 'DELETE') {
    const response = await fetch(`${BASE_URL}/${resource}/${id}`) ;
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    console.log(`Deleting ${resource} with ID: ${id}...`);
}else{
    console.error("Invalid method ${method}");
}

