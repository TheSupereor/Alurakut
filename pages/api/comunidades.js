import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(req, res) {
    
    if(req.method === 'POST'){
        const TOKEN = '0b175491a5f5b682fa7d123b32036a'; //token full-acess
        const client = new SiteClient(TOKEN);

        //deveríamos validar tudinho
        const registroCriado = await client.items.create({
            itemType: "977001",
            ...request.body,    //aqui pegamos todos os dados que vem com o body
            //title: req.title,
            //imageUrl: req.imageUrl,
            //creatorSlug: req.creatorSlug
        })

        response.json({
            dados: 'dado',
            registroCriado: registroCriado,
        })

        return;
    }

    res.status(404).json({
        message:'Sem resposta no GET'
    })
}