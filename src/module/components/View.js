export default function View({ children, style, hidden }) {
    return (
        <div hidden={hidden} style={{ minHeight: 0, display: 'flex', flexDirection: 'column', ...style }}>
            {children}
        </div>
    );
}
