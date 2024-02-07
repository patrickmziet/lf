import React from 'react';
import { ColorRing } from 'react-loader-spinner';

interface ColorRingSpinnerProps {
    visible?: boolean;
    height?: string;
    width?: string;
    colors?: [string, string, string, string, string];
}

export const ColorRingSpinner: React.FC<ColorRingSpinnerProps> = ({ visible = true, height = "45", width = "45", colors = ['#ff7f38', '#ff7f38', '#ff7f38', '#ff7f38','#ff7f38'] }) => {
    return (
        <ColorRing
            visible={visible}
            height={height}
            width={width}
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={colors}
        />
    );
};