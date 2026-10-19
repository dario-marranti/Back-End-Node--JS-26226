const [,, method, route, ...args] = process.argv;

if (!method || !route) {
    console.error('Uso: node index.js GET products/5');
    console.error('Uso: node index.js POST products "Título" 99.99 "categoría" "descripción"');
    console.error('Uso: node index.js DELETE products/1');
    process.exit(1);
}

const [resource, id] = route.split('/').filter(Boolean);
const BASE_URL = "https://fakestoreapi.com";

const req = async (url, options = {}) => {
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`¡Error HTTP! Status: ${res.status}`);
    }
    
    const text = await res.text();
    
    // Manejo de respuestas vacías o "null" devueltas por la API
    if (!text || text === "null") {
        if (options.method === 'DELETE') {
            return { success: true, message: "Recurso eliminado correctamente (respuesta vacía del servidor)" };
        }
        return { success: false, message: "El recurso solicitado no existe en la API." };
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
};

(async () => {
    try {
        if (method === 'GET') {
            const endpoint = id ? `${BASE_URL}/${resource}/${id}` : `${BASE_URL}/${resource}`;
            const data = await req(endpoint);
            console.log(data);

        } else if (method === 'POST') {
            const [title, price, category, description = 'Sin descripción', image = 'https://i.imgur.com/fakestore.png'] = args;
            
            if (!title || !price || !category) {
                console.error('Error: Faltan argumentos obligatorios para POST (title, price, category)');
                process.exit(1);
            }

            const newProduct = { title, price: Number(price), description, image, category };

            console.log('Enviando solicitud POST para crear el producto...');
            const data = await req(`${BASE_URL}/${resource}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });

            console.log('\nRespuesta de FakeStore API (Producto Creado):');
            console.log(data);

        } else if (method === 'DELETE') {
            if (!id) {
                console.error('Error: Se requiere un ID para eliminar (ej: products/1)');
                process.exit(1);
            }

            console.log(`Enviando solicitud DELETE para ${resource} con ID: ${id}...`);
            const data = await req(`${BASE_URL}/${resource}/${id}`, {
                method: 'DELETE'
            });

            console.log('\nRespuesta de FakeStore API (Elemento Eliminado):');
            console.log(data);

        } else {
            console.error(`Método inválido: ${method}`);
        }
    } catch (error) {
        console.error('Ocurrió un error en la ejecución:', error.message);
    }
})();