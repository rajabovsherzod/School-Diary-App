class ApiResponse {
    public readonly data: any
    public readonly message: string
    public readonly success: boolean = true

    constructor(data: any, message: string){
        this.data = data
        this.message = message
    }
}

export default ApiResponse