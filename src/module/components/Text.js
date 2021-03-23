import { headers } from 'styles';

export default function Text({ children, style }) {
    return <div style={{ display: 'inline', ...headers.H5(), ...style }}>{children}</div>;
}
