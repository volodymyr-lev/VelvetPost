

export function PixelArt() {
    const V = [
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,0],
    ];

    const P = [
        [1,1,1,1,1,1,0,0],
        [1,1,1,1,1,1,1,0],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,0,0,1,1,1],
        [1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,0,0],
        [1,1,1,0,0,0,0,0],
        [1,1,1,0,0,0,0,0],
        [1,1,1,0,0,0,0,0],
    ];

    return (
        <div className="pixel-art">
            <PixelLetter matrix={V} color="white" />
            <PixelLetter matrix={P} color="magenta" />
        </div>
    );
}

export function PixelLetter({ matrix, color }) {
    return (
        <div className="pixel-letter">
            {matrix.map((row, rowIndex) => (
                row.map((dot, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`dot ${dot ? color : "empty"}`}
                    />
                ))
            ))}
        </div>
    );
}