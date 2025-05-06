import axios from "axios";

export const getTerminals = async ()=>{
    const token = localStorage.getItem("token");

    try{
        const response = await axios.get("https://localhost:7047/api/Terminals", { 
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.error("Помилка під час отримання терміналів: ", error);
        throw error;
    }
}

export const updateTerminal = async (id, updated)=>{
    const token = localStorage.getItem("token");
        
    try{
        const response = await axios.put(
            `https://localhost:7047/api/Terminals/${id}`,
            updated,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Помилка при оновленні термінала: ", error);
        throw error;
    }
}


export const deleteTerminal = async (id)=>{
    const token = localStorage.getItem("token");

    try{
        const response = await axios.delete(
            `https://localhost:7047/api/Terminals/${id}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data;
    } catch (error) {
        console.error("Помилка при видаленні термінала: ", error);
        throw error;
    } 
}


export const createTerminal = async (terminal) =>{
    const token = localStorage.getItem("token");

    try{
        const response = await axios.post(
            `https://localhost:7047/api/Terminals/create`,
            terminal,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response.data;
    } catch (error) {
        console.log("Помилка при створенні термінала: ", error);
        throw error;
    }
}

export const getTerminalById = async (id) => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.get(`https://localhost:7047/api/Terminals/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        return response.data;
    }
    catch (error) {
        console.error("Помилка при отриманні термінала за ID: ", error);
        throw error;
    }
}
