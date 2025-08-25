import styles from "./Loading.module.scss";

export default function Loading() {
  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", gap: "1rem"}}>
      <div
      className={`${styles.AnimatePingOne}`}
        style={{
          width: "25px",
          height: "25px",
          backgroundColor: "#60cfae",
          borderRadius: "50%",
        }}
      ></div>
      <div
      className={`${styles.AnimatePingTwo}`}
        style={{
          width: "25px",
          height: "25px",
          backgroundColor: "#60cfae",
          borderRadius: "50%",
        }}
      ></div>
      <div
      className={`${styles.AnimatePingThree}`}
        style={{
          width: "25px",
          height: "25px",
          backgroundColor: "#60cfae",
          borderRadius: "50%",
        }}
      ></div>
    </div>
  );
}
