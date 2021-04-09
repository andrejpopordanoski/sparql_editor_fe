export default function View({ children, style, hidden, onMouseEnter, onMouseLeave, className, onClick }) {
    return (
        <div
            className={className}
            hidden={hidden}
            style={{ minHeight: 0, display: 'flex', flexDirection: 'column', ...style }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
