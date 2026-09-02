import React from 'react';
import { AdventureQuest } from '../../types';
import { ChestLockWidget } from './widgets/ChestLockWidget';
import { CrystalScaleWidget } from './widgets/CrystalScaleWidget';
import { SteppingStonesWidget } from './widgets/SteppingStonesWidget';
import { MagicChargeWidget } from './widgets/MagicChargeWidget';
import { AncientTabletWidget } from './widgets/AncientTabletWidget';
import { PotionAlchemyWidget } from './widgets/PotionAlchemyWidget';
import { CompassDialWidget } from './widgets/CompassDialWidget';
import { RpgActionWidget } from './widgets/RpgActionWidget';

interface GenerativeUIQuestRendererProps {
  quest: AdventureQuest;
  isEvaluated: boolean;
  isCorrect: boolean;
  onSelectAnswer: (answer: string) => void;
}

export const GenerativeUIQuestRenderer: React.FC<GenerativeUIQuestRendererProps> = ({
  quest,
  isEvaluated,
  isCorrect,
  onSelectAnswer,
}) => {
  const { uiConfig } = quest;

  switch (uiConfig.widgetType) {
    case 'chest_lock':
      return (
        <ChestLockWidget
          config={uiConfig}
          isEvaluated={isEvaluated}
          isCorrect={isCorrect}
          onSelectAnswer={onSelectAnswer}
        />
      );

    case 'crystal_scale':
      return (
        <CrystalScaleWidget
          config={uiConfig}
          isEvaluated={isEvaluated}
          isCorrect={isCorrect}
          onSelectAnswer={onSelectAnswer}
        />
      );

    case 'stepping_stones':
      return (
        <SteppingStonesWidget
          config={uiConfig}
          isEvaluated={isEvaluated}
          isCorrect={isCorrect}
          onSelectAnswer={onSelectAnswer}
        />
      );

    case 'magic_charge':
      return (
        <MagicChargeWidget
          config={uiConfig}
          isEvaluated={isEvaluated}
          isCorrect={isCorrect}
          onSelectAnswer={onSelectAnswer}
        />
      );

    case 'ancient_tablet':
      return (
        <AncientTabletWidget
          config={uiConfig}
          isEvaluated={isEvaluated}
          isCorrect={isCorrect}
          onSelectAnswer={onSelectAnswer}
        />
      );

    case 'potion_alchemy':
      return (
        <PotionAlchemyWidget
          config={uiConfig}
          isEvaluated={isEvaluated}
          isCorrect={isCorrect}
          onSelectAnswer={onSelectAnswer}
        />
      );

    case 'compass_dial':
      return (
        <CompassDialWidget
          config={uiConfig}
          isEvaluated={isEvaluated}
          isCorrect={isCorrect}
          onSelectAnswer={onSelectAnswer}
        />
      );

    case 'rpg_action':
    default:
      return (
        <RpgActionWidget
          config={uiConfig}
          isEvaluated={isEvaluated}
          isCorrect={isCorrect}
          onSelectAnswer={onSelectAnswer}
        />
      );
  }
};
