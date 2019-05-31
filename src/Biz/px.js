import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get("window");
const deviceWidth = width;

export default function px(size) {
    if (PixelRatio.get() >= 3 && Platform.Os === 'ios' && size === 1) {
        return size;
    }
    return deviceWidth / 750 * size;
}