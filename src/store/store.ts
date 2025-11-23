import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService"
import Cookies from "js-cookie";
import axios from "axios";
import {API_URL} from "../http";
import {IUser} from "../models/IUser";

export default class Store {
    isAuth = false
    isLoading = true
    user : IUser | null = null

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setLoading(bool: boolean) {
        this.isLoading = bool
    }

    setUser(user: IUser | null) {
        this.user = user;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password)
            const user = await UserService.getUserByEmail(email)
            localStorage.setItem("id", String(user.data.id))
            this.setUser(user.data)
            this.setAuth(true)

        }
        catch (e) {
            console.log(e)
        }
    }

    async loginOAuth(userId: bigint) {
        try {
            const user = await UserService.getUserById(userId)
            localStorage.setItem("id", String(user.data.id))
            this.setUser(user.data)
            this.setAuth(true)

        }
        catch (e) {
            console.log(e)
        }
    }

    async register(email: string, password: string) {
        try {
            await AuthService.register(email, password)
        }
        catch (e) {
            console.log(e)
            return e
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout()
            Cookies.remove('token')
            localStorage.removeItem("id")
            this.setAuth(false)
        }
        catch (e) {
            console.log(e)
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const userId : string | null = localStorage.getItem("id")
            const response = await axios.get(`${API_URL}/users/${userId}`, { withCredentials: true });
            if (response.status === 200) {
                this.setAuth(true);
                this.setUser(response.data)
            } else {
                this.setAuth(false);
            }
        } catch (e) {
            console.log(e);
        } finally {
            this.setLoading(false);
        }
    }
}

