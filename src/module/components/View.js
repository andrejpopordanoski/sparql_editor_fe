export default function View({ children, style }) {
    return <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column', ...style }}>{children}</div>;
}
