import axios from 'axios'


function signUpForm() {
    return (
        <></>
    )
}

function Landing() {

    const handleLogIn = async (evt) => {

        evt.preventDefault()

        let data = await axios.get(`http://localhost:8080/user/getUser/${evt.target.email.value}`);

    }

    const handleSignUp = async (evt) => {
        evt.preventDefault();

        const userData = {
            firstName: evt.target.firstName.value,
            lastName: evt.target.lastName.value,
            email: evt.target.email.value,
            phone: evt.target.phone.value,
            password: evt.target.password.value
        }

        evt.target.reset();
        await axios.post("http://localhost:8080/user/newUser", userData);
    }



    return (
        <>
            <div class="flex">
                <div class="flex flex-col top-0 h-screen w-1/2 bg-primary items-center justify-center">
                    <div class="flex flex-col items-center justify-center w-2/3 bg-none h-2/3">
                        <h1 class="mb-12 text-3xl text-white font-medium">Log in to CommonCents</h1>
                        <form onSubmit={handleLogIn} class="w-full flex flex-col items-center justify-center" action="/">
                            <label htmlFor="email" class="self-start pl-28 text-greytext">Email</label>
                            <input class="h-12 w-2/3 text-lg p-2 bg-white rounded-lg" type="text" name="email" id="" />
                            <label htmlFor="password" class="self-start pl-28 mt-5 text-greytext">Password</label>
                            <input class="h-12 w-2/3 text-lg p-2 bg-white rounded-lg" type="password" name="password" />
                            <button class="bg-secondary w-xs h-15 mt-7 rounded-4xl text-white hover:cursor-pointer hover:bg-purple-400">Log In</button>
                        </form>
                    </div>
                </div>

                <div class="flex flex-col h-screen w-1/2 top-0 text-center bg-secondary items-center justify-center">
                    <h1 class="text-5xl text-white font-bold">New Here?</h1>
                    <p class="text-greytext w-md">Get started with the common cents app and start taking control of your finances</p>
                    <form onSubmit={handleSignUp} class="w-full flex flex-col items-center justify-center" action="/">

                        <label htmlFor="firstName" class="self-start pl-40 mt-5 text-gray-900">First name</label>
                        <input class="h-12 w-2/3 text-lg p-2 bg-white rounded-lg" type="text" name="firstName" />

                        <label htmlFor="lastName" class="self-start pl-40 mt-5 text-gray-900">Last name</label>
                        <input class="h-12 w-2/3 text-lg p-2 bg-white rounded-lg" type="text" name="lastName" />

                        <label htmlFor="email" class="self-start mt-5 pl-40 text-gray-900">Email</label>
                        <input class="h-12 w-2/3 text-lg p-2 bg-white rounded-lg" type="email" name="email" id="" />

                        <label htmlFor="phone" class="self-start pl-40 mt-5 text-gray-900">Phone number</label>
                        <input class="h-12 w-2/3 text-lg p-2 bg-white rounded-lg" type="text" name="phone" />

                        <label htmlFor="password" class="self-start pl-40 mt-5 text-gray-900">Password</label>
                        <input class="h-12 w-2/3 text-lg p-2 bg-white rounded-lg" type="password" name="password" />

                        <button class="bg-secondary w-xs h-15 mt-7 rounded-4xl text-white hover:cursor-pointer border-2 border-white">Sign Up</button>
                    </form>
                </div>
            </div >

        </>
    )
}

export default Landing;