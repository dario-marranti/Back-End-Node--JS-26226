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
    console.log(`Creating new ${resource} with data:`, args.join(" "));

} else if(method === 'DELETE') {
    console.log(`Deleting ${resource} with ID: ${id}...`);
}else{
    console.error("Invalid method ${method}");
}

