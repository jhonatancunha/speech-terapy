import {
  AlertCircle,
  CheckCircle,
  LucideIcon,
  XCircle,
} from 'lucide-react-native';
import { cssInterop } from 'nativewind';

const interopIcon = (icon: LucideIcon) => {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
};

interopIcon(AlertCircle);
interopIcon(CheckCircle);
interopIcon(XCircle);

export { AlertCircle, CheckCircle, XCircle };
