import axios from 'axios'


function Landing() {


    const getUser = async () => {
        let data = await axios.get('http://localhost:8080/user/getUsers');
        console.log(data);
    }

    getUser()

    return (
        <>
            <div class="flex">
                <div class="flex flex-col top-0 h-screen w-1/2 bg-primary items-center justify-center">
                    <div class="flex flex-col items-center justify-center w-2/3 bg-none h-2/3 rounded-xl border-2 border-solid border-purple-800">
                        <form class="w-full flex flex-col items-center justify-center" action="/">
                            <input class="h-12 w-2/3 text-lg p-2 bg-white rounded-lg" type="text" name="" id="" />
                            <input class="h-12 w-2/3 text-lg p-2 bg-white rounded-lg mt-5" type="password" />
                            <button class="bg-purple-700 w-1/3 h-16 mt-7 rounded-lg text-white hover:cursor-pointer hover:bg-purple-400">Log In</button>
                        </form>
                    </div>
                </div>
                <div class="flex flex-col h-screen w-1/2 top-0 text-center">
                    <img class=" object-cover opacity-20" src="https://img.freepik.com/premium-photo/financial-insights-stock-market-investment-trading-coin-graph-vertical-mobile-wallpaper_892776-20418.jpg?w=360" alt="" />
                </div>
            </div>

        </>
    )
}

export default Landing;