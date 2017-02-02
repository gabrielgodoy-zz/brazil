import {reusableTransition} from '../config';
import {svgShadow} from '../../../helpers';
import createLayerLine from './layerLine';
import createLayerDot from './layerDot';
import createLayerTooltip from './layerTooltip';
import createLayerGuideline from './layerGuideline';

let render;
export default function renderContent(svgGroup, data, scales) {
  svgShadow(svgGroup);

  render = function(data) {
    createLayerLine(svgGroup, data, scales, reusableTransition);
    createLayerGuideline(svgGroup, data, scales, reusableTransition);
    createLayerDot(svgGroup, data, scales, reusableTransition);
    createLayerTooltip(svgGroup, data, scales, reusableTransition);
  };
  render(data);
}
