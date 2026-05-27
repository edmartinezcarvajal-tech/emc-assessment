export const AREAS = [
  {
    id: 'kpi',
    icon: '📊',
    name: 'KPI Visibility & Intelligence',
    discovery: [
      { q: 'What are the 3 most important metrics your team tracks right now?', probe: 'Do they know them by heart, or do they have to look them up?' },
      { q: 'How often does leadership review performance data with the team?', probe: 'Weekly? Monthly? Only when there is a problem?' },
      { q: 'If performance drops this week, how quickly would you know — and how?', probe: 'Is there an alert, a report, or does someone tell you?' }
    ],
    diagnostic: [
      { q: 'Who owns each KPI — one person, or is it shared?', probe: 'Shared ownership often means no real ownership.' },
      { q: 'Are KPIs visible to agents/reps in real time, or only to managers?', probe: 'Visibility gap at the front line is a common execution killer.' },
      { q: 'How do you distinguish leading indicators from lagging indicators in your reporting?', probe: 'Teams that only track lagging KPIs are always reacting, never preventing.' },
      { q: 'What happens when a KPI misses its target — is there a defined response protocol?' },
      { q: 'Are KPI targets connected to any incentive or consequence, or are they just numbers on a dashboard?' },
      { q: 'How confident are you that the data behind your KPIs is clean and accurate?', probe: 'Data trust is often the hidden bottleneck.' }
    ],
    flags: [
      { label: 'No real-time visibility', color: 'red' },
      { label: 'KPIs not known by team', color: 'red' },
      { label: 'No ownership per metric', color: 'amber' },
      { label: 'Only lagging indicators', color: 'amber' },
      { label: 'Data quality issues', color: 'red' },
      { label: 'Solid KPI culture', color: 'green' }
    ]
  },
  {
    id: 'accountability',
    icon: '🛡️',
    name: 'Accountability Systems',
    discovery: [
      { q: 'When someone misses their target, what typically happens next?', probe: 'Is there a clear process, or does it depend on the manager?' },
      { q: 'Does your team have documented performance expectations beyond just hitting numbers?', probe: 'Behavior standards, response times, quality benchmarks?' },
      { q: 'Do people on your team know exactly what they are accountable for, individually?' }
    ],
    diagnostic: [
      { q: 'Is there a formal performance review cycle in place — and is it actually followed?', probe: 'Many teams have the structure on paper but not in practice.' },
      { q: 'How are underperformers handled — is the process consistent across managers?' },
      { q: 'Are there documented SOPs for each role, or is knowledge tribal/verbal?' },
      { q: 'How is accountability enforced in a remote environment — what tools or rituals support it?' },
      { q: 'Do team leads have the authority to act on accountability issues, or do they escalate everything up?', probe: 'Leadership without authority creates execution paralysis.' },
      { q: 'What is the consequence of consistently missing targets, and is that consequence visible to the team?' }
    ],
    flags: [
      { label: 'No consistent process', color: 'red' },
      { label: 'Tribal knowledge only', color: 'amber' },
      { label: 'Manager-dependent', color: 'amber' },
      { label: 'No documented SOPs', color: 'red' },
      { label: 'Weak remote accountability', color: 'red' },
      { label: 'Clear ownership culture', color: 'green' }
    ]
  },
  {
    id: 'leadership',
    icon: '👥',
    name: 'Leadership Effectiveness',
    discovery: [
      { q: 'How would your team describe your management style if I asked them directly?', probe: 'This usually surfaces the gap between self-perception and team reality.' },
      { q: 'When your team has a problem, do they come to you first — or do they try to solve it alone?' },
      { q: 'How often do you have structured 1:1s with your direct reports?' }
    ],
    diagnostic: [
      { q: 'Do your team leads spend more time coaching or firefighting?', probe: 'The ratio tells you a lot about operational health.' },
      { q: 'How does leadership currently identify who on the team needs support vs. who is coasting?' },
      { q: 'Is feedback given proactively and regularly, or only when something goes wrong?' },
      { q: "Do managers have a clear understanding of each agent/rep's development stage and growth plan?" },
      { q: 'How aligned are your team leads on expectations, standards, and what good performance looks like?', probe: 'Misalignment at the lead level amplifies inconsistency at the team level.' },
      { q: 'When a top performer leaves, what does the knowledge transfer process look like?' }
    ],
    flags: [
      { label: 'Reactive leadership style', color: 'red' },
      { label: 'Low team trust in mgmt', color: 'red' },
      { label: 'No structured 1:1s', color: 'amber' },
      { label: 'Leads misaligned', color: 'amber' },
      { label: 'No development plans', color: 'amber' },
      { label: 'Strong coaching culture', color: 'green' }
    ]
  },
  {
    id: 'workflow',
    icon: '⚙️',
    name: 'Workflow & Processes',
    discovery: [
      { q: 'Walk me through what a typical day looks like for someone on your front-line team.', probe: 'Listen for unplanned interruptions, system switching, redundant steps.' },
      { q: 'What is the biggest time-waster your team deals with on a daily basis?' },
      { q: 'Are your current tools helping the team work faster, or creating friction?' }
    ],
    diagnostic: [
      { q: 'How many tools does a front-line agent/rep use in a single workday?', probe: 'Tool overload is one of the most common hidden productivity killers.' },
      { q: "Are there manual steps in your workflow that could be automated but haven't been yet?" },
      { q: 'How is work assigned and prioritized — is there a system, or is it ad hoc?' },
      { q: 'What happens when a key process breaks — is there a documented escalation path?' },
      { q: 'How long does onboarding take before a new hire reaches full productivity?', probe: 'Onboarding duration is a proxy for process clarity and documentation quality.' },
      { q: 'Are processes reviewed and updated regularly, or are teams running on outdated workflows?' }
    ],
    flags: [
      { label: 'Excessive tool switching', color: 'red' },
      { label: 'No escalation path', color: 'red' },
      { label: 'Ad hoc prioritization', color: 'amber' },
      { label: 'Slow onboarding', color: 'amber' },
      { label: 'Manual bottlenecks', color: 'amber' },
      { label: 'Well-documented processes', color: 'green' }
    ]
  },
  {
    id: 'communication',
    icon: '💬',
    name: 'Communication Structure',
    discovery: [
      { q: 'How does important information get from leadership to front-line teams today?', probe: 'Email, Slack, meetings, or word of mouth?' },
      { q: 'When something changes operationally, how quickly does the whole team know about it?' },
      { q: 'Is there a consistent rhythm for team communication — daily standups, weekly syncs?' }
    ],
    diagnostic: [
      { q: 'Are meeting structures defined — clear agenda, owner, decisions documented?', probe: 'Unstructured meetings are one of the biggest hidden time costs in ops teams.' },
      { q: 'How does the team communicate cross-functionally — between sales, CS, ops, leadership?' },
      { q: 'Is there a clear distinction between synchronous and asynchronous communication — or is everything real-time?' },
      { q: 'How are decisions communicated downward — and how do you confirm they were understood?' },
      { q: 'Is there a documented communication protocol for escalations or urgent issues?' },
      { q: 'What percentage of communication is reactive (responding to problems) vs. proactive (preventing them)?', probe: 'This ratio is a strong signal of operational maturity.' }
    ],
    flags: [
      { label: 'No communication rhythm', color: 'red' },
      { label: 'Information silos', color: 'red' },
      { label: 'No meeting structure', color: 'amber' },
      { label: 'Over-reliance on real-time', color: 'amber' },
      { label: 'Reactive communication culture', color: 'red' },
      { label: 'Clear communication cadence', color: 'green' }
    ]
  },
  {
    id: 'team',
    icon: '🏆',
    name: 'Team Performance',
    discovery: [
      { q: 'If you had to rank your team into top, middle, and low performers right now — what does that breakdown look like?' },
      { q: 'What separates your top performers from the rest — is it skill, effort, process knowledge, or something else?' },
      { q: 'How is recognition handled when someone performs well?' }
    ],
    diagnostic: [
      { q: 'Do you have a clear performance segmentation model — and is it used to drive different management approaches?' },
      { q: 'What does your bottom-performer management process look like — PIP, coaching, reassignment?' },
      { q: 'How is individual performance communicated to each team member — and how frequently?' },
      { q: 'Are performance conversations scheduled, or do they only happen when there is a problem?' },
      { q: 'Is there a skill gap analysis process to identify where the team needs development?' },
      { q: 'How does team morale impact performance — and how do you currently measure or sense morale?', probe: 'Morale is often an invisible performance driver that gets ignored until attrition hits.' }
    ],
    flags: [
      { label: 'No performance segmentation', color: 'amber' },
      { label: 'High attrition risk', color: 'red' },
      { label: 'No skill gap analysis', color: 'amber' },
      { label: 'Recognition gap', color: 'amber' },
      { label: 'Low morale signals', color: 'red' },
      { label: 'High-performing culture', color: 'green' }
    ]
  },
  {
    id: 'decisions',
    icon: '💡',
    name: 'Decision-Making',
    discovery: [
      { q: 'When you need to make an operational decision, where does the data come from?', probe: 'Gut, reports, real-time dashboards, team feedback?' },
      { q: 'How long does it typically take to make a significant operational change once a problem is identified?' },
      { q: 'Who has the authority to make day-to-day operational decisions without escalating?' }
    ],
    diagnostic: [
      { q: 'Is decision-making centralized at leadership, or distributed to front-line managers?', probe: 'Over-centralized decisions create bottlenecks; under-centralized ones create inconsistency.' },
      { q: 'Are decisions documented — so the team understands the reasoning, not just the outcome?' },
      { q: 'How do you distinguish between decisions that need data vs. decisions that need speed?' },
      { q: 'What is the process when a decision made by leadership turns out to be wrong?', probe: 'Error recovery process reflects decision-making maturity.' },
      { q: 'Are there recurring decisions that could be systematized but currently require manual judgment each time?' },
      { q: 'How much of leadership time is spent making tactical vs. strategic decisions?', probe: 'The ratio reveals operational maturity and delegation health.' }
    ],
    flags: [
      { label: 'Over-centralized decisions', color: 'amber' },
      { label: 'No data in decisions', color: 'red' },
      { label: 'Slow decision cycles', color: 'amber' },
      { label: 'No decision documentation', color: 'amber' },
      { label: 'Tactical overload on leadership', color: 'red' },
      { label: 'Data-driven culture', color: 'green' }
    ]
  },
  {
    id: 'execution',
    icon: '🚀',
    name: 'Execution Gaps',
    discovery: [
      { q: 'When a new process or initiative is rolled out, what percentage of the team actually follows it consistently?' },
      { q: 'What is the biggest gap between what leadership wants to happen and what actually happens on the floor?' },
      { q: 'Is there anything your team is supposed to be doing right now that you know is not being done?' }
    ],
    diagnostic: [
      { q: 'How do you verify that a process is being followed — random audits, dashboards, manager observation?' },
      { q: 'Are there examples of initiatives that were launched but never fully adopted? What happened?', probe: 'Abandoned initiatives are a signal of accountability or change management failure.' },
      { q: 'How is execution consistency tracked across different team members or shifts?' },
      { q: 'When execution breaks down, is the root cause usually skill, will, or process design?', probe: 'The answer determines the fix — training, accountability, or redesign.' },
      { q: 'Are there KPIs specifically tracking execution quality — not just outcomes?' },
      { q: 'How quickly can leadership detect an execution failure — and what triggers the detection?' }
    ],
    flags: [
      { label: 'Low adoption on rollouts', color: 'red' },
      { label: 'Execution not monitored', color: 'red' },
      { label: 'Skill/will confusion', color: 'amber' },
      { label: 'No execution KPIs', color: 'amber' },
      { label: 'Initiative graveyard', color: 'red' },
      { label: 'Strong execution discipline', color: 'green' }
    ]
  },
  {
    id: 'remote',
    icon: '🌐',
    name: 'Remote Team Dynamics',
    discovery: [
      { q: 'How do you maintain visibility into what remote team members are doing throughout the day?' },
      { q: 'What is the biggest challenge you face managing a remote team compared to an in-person one?' },
      { q: 'How connected does the remote team feel to the company culture and each other?' }
    ],
    diagnostic: [
      { q: 'What tools and rituals are in place specifically to manage remote performance and presence?', probe: 'Tools without rituals are shelfware.' },
      { q: 'How is remote onboarding structured — and how does it compare to in-person onboarding effectiveness?' },
      { q: 'Are there documented remote work expectations around availability, response times, and communication?' },
      { q: 'How do you identify disengagement in a remote team member before it becomes an attrition risk?' },
      { q: 'How are remote team leads trained differently — or are they managed the same as in-person leads?', probe: 'Remote leadership requires a different skill set that most companies ignore.' },
      { q: 'What is your policy for performance management in a remote setting — and is it consistently applied?' }
    ],
    flags: [
      { label: 'No remote visibility tools', color: 'red' },
      { label: 'Weak remote culture', color: 'amber' },
      { label: 'No remote-specific SOPs', color: 'amber' },
      { label: 'Disengagement risk', color: 'red' },
      { label: 'Remote leads undertrained', color: 'amber' },
      { label: 'Strong remote infrastructure', color: 'green' }
    ]
  }
]
