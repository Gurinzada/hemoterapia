interface ContainerProps {
    children: React.ReactNode
}

export default function Container({children}:ContainerProps){
    return(
        <main style={{margin: "1.2rem"}}>{children}</main>
    )
}