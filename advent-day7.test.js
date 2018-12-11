const fs = require('fs-extra');
const path = require('path');

const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(path.join(__dirname, 'input7.txt'))
});

let workersStatusPerSeconds = [...Array(1)]
    .map(_ => [...Array(5)]
        .map(_ => {
            return {step: '.', time: 0}
        }));

test('adventDay71', () => {
    readStepDependencies().then(stepDependencies => {
        let result = '';

        while (stepDependencies.notSolvedSteps.length !== 0) {
            let newStep = findFirstNotDependentStep(stepDependencies);
            result = result.concat(newStep);
            consumeDependency(newStep, stepDependencies);
        }

        console.log(result);
        expect(result).toEqual('CABDFE');
    });
});

test('adventDay72', () => {
    readStepDependencies().then(stepDependencies => {
        while (stepDependencies.notSolvedSteps.length !== 0) {

            let worker = getAvailableWorker();
            while (worker != null) {
                let newStep = findFirstNotDependentStep(stepDependencies);
                if (newStep == null) {
                    break;
                }

                worker.step = newStep;

                worker = getAvailableWorker();
            }

            // param may be global
            passSecond(stepDependencies);
        }

        console.log(workersStatusPerSeconds.length);
    });
});

let passSecond = (stepDependencies) => {
    // new array of workers for new last second.
    let workersPerSecond = getCurrentWorkers().slice(0);

    workersStatusPerSeconds.push(workersPerSecond.map(worker => {
        if (worker.time === worker.step.charCodeAt(0) - 65 + 60) {
            // idle worker
            consumeDependency(worker.step, stepDependencies);
            return {
                step: '.',
                time: 0
            }
        } else {
            // increment time if step
            return {
                ...worker,
                time: worker.step === '.' ? 0 : ++worker.time
            }
        }
    }));
};

let getCurrentWorkers = () => {
    return workersStatusPerSeconds[workersStatusPerSeconds.length - 1];
};

let getAvailableWorker = () => {
    return getCurrentWorkers().find(worker => worker.step === '.');
};

let consumeDependency = (step, stepDependencies) => {
    delete stepDependencies.dependencies[step];

    let indexOfStep = stepDependencies.notSolvedSteps.indexOf(step);
    stepDependencies.notSolvedSteps.splice(indexOfStep, 1);

    Object.keys(stepDependencies.dependencies).forEach(key => {
        let idx = stepDependencies.dependencies[key].indexOf(step);

        if (idx >= 0) {
            stepDependencies.dependencies[key].splice(idx, 1);
        }
    })
};

let findFirstNotDependentStep = stepDependencies => {
    return stepDependencies.notSolvedSteps
        .filter(el => !getCurrentWorkers().map(w => w.step).includes(el)) // work in progress (test 1 will never apply)
        .find(el => {
            if (!Object.keys(stepDependencies.dependencies).includes(el)) {
                return true;
            }

            return stepDependencies.dependencies[el].length === 0;
        })
};

let readStepDependencies = () => {
    return readFile().then((inputLines) => {
        let stepDependencies = inputLines.reduce((acc, c) => {
            //Step P must be finished before step G can begin.
            let parts = /Step (.) must be finished before step (.) can begin./g.exec(c);

            if (acc.dependencies[parts[2]] == null) {
                acc.dependencies[parts[2]] = [];
            }

            if (!acc.dependencies[parts[2]].includes(parts[1])) {
                acc.dependencies[parts[2]].push(parts[1]);
            }
            acc.dependencies[parts[2]].sort();

            acc.allSteps.add(parts[1]);
            acc.allSteps.add(parts[2]);

            return acc;
        }, {dependencies: {}, allSteps: new Set()});

        stepDependencies.allSteps = [...stepDependencies.allSteps].sort();
        stepDependencies.notSolvedSteps = stepDependencies.allSteps;
        return stepDependencies;
    });
};

let readFile = () => {
    return new Promise(resolve => {
        let inputLines = [];
        lineReader
            .on('line', (line) => {
                inputLines.push(line);
            })
            .on('close', () => {
                resolve(inputLines);
            });
    })
};




