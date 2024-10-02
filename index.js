const axios = require("axios");
require("dotenv").config();

const axiosInst = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: parseInt(process.env.TIMEOUT)
});

async function main(){
    try{
        const mockResp = await axiosInst.get('/posts/1');
        console.log("GET response", mockResp.data);
    } catch(error){
        console.error("Error in GET-ting ", error);
    }

    try{
        const mockPost = await axiosInst.post('/posts/', {
            title: 'New post',
            body: 'New post dummy body',
            userId: 1
        });
        console.log("POST response ", mockPost);
    } catch(error){
        console.error('Error in POST Request:', error.message);
    }

    axiosInst.interceptors.request.use(
        (config)=>{
            console.log("Request interceptor triggered ");
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    axiosInst.get('/posts/1', {
        cancelToken: source.token
    }).then(response=>{
        console.log('Response:', response.data);
    }).catch( thrown=>{
        if(axios.isCancel(thrown)){
            console.log('Request canceled', thrown.message);
        }else{
            console.error("GET failed = ", thrown);
        }
    });

    setTimeout(()=>{
        source.cancel("Cancelling the outgoing request")
    },500)
}

main();