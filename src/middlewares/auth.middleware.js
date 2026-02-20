export const checkApiKey = (req, res, next) => {
    // Buscamos a chave no cabeçalho 'x-api-key'
    const apiKey = req.header('x-api-key');
    const secretKey = process.env.API_KEY;

    // Se a chave não existir ou for diferente da definida no servidor
    if (!apiKey || apiKey !== secretKey) {
        return res.status(401).json({
            error: "Acesso negado. Chave de API inválida ou ausente."
        });
    }

    // Se estiver tudo certo, segue para a rota
    next();
};