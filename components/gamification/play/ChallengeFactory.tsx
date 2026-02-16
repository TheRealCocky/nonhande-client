import { ChallengeProps } from './types';
import MultipleChoice from './challenges/MultipleChoice';
import WordBank from './challenges/WordBank';
import Pairs from './challenges/Pairs';
import FillBlank from './challenges/FillBlank';

export const ChallengeFactory = ({ activity, isAnswered, onSetAnswer }: ChallengeProps) => {
    const type = activity.type;

    switch (type) {
        case 'SELECT':
        case 'LISTEN_SELECT':
            return (
                <MultipleChoice
                    activity={activity}
                    isAnswered={isAnswered}
                    onSetAnswer={onSetAnswer}
                />
            );

        case 'TRANSLATE':
        case 'LISTEN_ORDER':
            return (
                <WordBank
                    activity={activity}
                    isAnswered={isAnswered}
                    onSetAnswer={onSetAnswer}
                />
            );

        case 'PAIRS':
            return (
                <Pairs
                    activity={activity}
                    isAnswered={isAnswered}
                    onSetAnswer={onSetAnswer}
                />
            );

        case 'FILL_BLANK':
            return (
                <FillBlank
                    activity={activity}
                    isAnswered={isAnswered}
                    onSetAnswer={onSetAnswer}
                />
            );

        default:
            return (
                <div className="p-10 text-center border-2 border-dashed rounded-2xl">
                    <p className="text-muted-foreground">
                        Tipo de desafio "{type}" ainda não implementado.
                    </p>
                </div>
            );
    }
};