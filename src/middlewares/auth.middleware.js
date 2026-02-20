export const checkApiKey = (req, res, next) => {
    // Pegamos a chave do header (garantindo que não haja espaços em branco)
    const apiKey = req.header('x-api-key')?.trim();
    const secretKey = process.env.API_KEY?.trim();

    // LOGS DE DIAGNÓSTICO (Aparecerão no 'fly logs')
    console.log('--- Verificação de Segurança ---');
    console.log('Header x-api-key recebido:', apiKey ? 'Presente' : 'AUSENTE');

    // Verificação de segurança
    if (!apiKey || apiKey !== secretKey) {
        console.error('ERRO: Chaves não conferem!');
        return res.status(401).json({
            error: "Acesso negado. Chave de API inválida ou ausente.",
            hint: "Verifique o header x-api-key"
        });
    }

    console.log('AUTORIZADO: Chave válida.');
    next();
};