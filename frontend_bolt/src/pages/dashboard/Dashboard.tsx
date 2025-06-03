import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Sector } from 'recharts';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardSummary } from '@/data/mockData';
import { Users, FileText, DollarSign, ClipboardList } from 'lucide-react';
import { useState } from 'react';

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  value: number;
}

type ChartDataItem = {
  source?: string;
  plan?: string;
  count: number;
};

interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: ChartDataItem;
  percent: number;
  value: number;
}

export default function Dashboard() {
  const {
    totalUsers,
    activeUsers,
    totalLeads,
    newLeadsToday,
    totalContracts,
    activeContracts,
    totalRevenue,
    pendingCommissions,
    revenueByMonth,
    leadsBySource,
    contractsByPlan,
  } = dashboardSummary;

  // State for hover animation
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activePlanIndex, setActivePlanIndex] = useState(-1);

  // Professional corporate color palette - dark but distinguishable
  const sourceColors = [
    '#2563eb', // Blue 600 - Professional blue
    '#059669', // Emerald 600 - Professional green  
    '#dc2626', // Red 600 - Professional red
    '#7c3aed', // Violet 600 - Professional purple
    '#ea580c', // Orange 600 - Professional orange
    '#0891b2', // Cyan 600 - Professional cyan
    '#4338ca', // Indigo 600 - Professional indigo
    '#be123c', // Rose 600 - Professional rose
  ];
  
  const planColors = [
    '#2563eb', // Blue 600 - Professional blue
    '#059669', // Emerald 600 - Professional green
    '#7c3aed', // Violet 600 - Professional purple
  ];
  
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const onPlanPieEnter = (_: any, index: number) => {
    setActivePlanIndex(index);
  };

  const onPlanPieLeave = () => {
    setActivePlanIndex(-1);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const textAnchor = cos >= 0 ? 'start' : 'end';
    const percentage = `${(percent * 100).toFixed(0)}%`;

    return (
      <g>
        <text 
          x={x} 
          y={y} 
          textAnchor={textAnchor} 
          fill="hsl(var(--foreground))"
          className="text-xs font-medium"
        >
          {`${name} (${percentage})`}
        </text>
        <text
          x={x}
          y={y}
          dy={16}
          textAnchor={textAnchor}
          fill="hsl(var(--muted-foreground))"
          className="text-xs"
        >
          {value} {value === 1 ? 'item' : 'itens'}
        </text>
      </g>
    );
  };

  const renderActiveShape = (props: ActiveShapeProps) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const label = payload.source || payload.plan;

    return (
      <g>
        <text 
          x={cx} 
          y={cy} 
          dy={-5} 
          textAnchor="middle" 
          fill="hsl(var(--foreground))"
          className="text-sm font-medium"
        >
          {label}
        </text>
        <text 
          x={cx} 
          y={cy} 
          dy={15} 
          textAnchor="middle" 
          fill="hsl(var(--muted-foreground))"
          className="text-xs"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="transition-all duration-200"
        />
      </g>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Dashboard" 
        description="Visão geral do sistema AutoCred"
      />
      
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeUsers} ativos
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{newLeadsToday} hoje
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contratos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeContracts} ativos
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatter.format(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatter.format(pendingCommissions)} em comissões pendentes
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Faturamento por mês em 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--foreground))' }} />
                  <YAxis
                    tickFormatter={(value) => `R$${value}`}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip
                    formatter={(value) => [`R$ ${value}`, 'Receita']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--revenue-chart))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:row-span-2">
          <CardHeader>
            <CardTitle>Leads por Fonte</CardTitle>
            <CardDescription>Distribuição de leads por canal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="source"
                    label={renderCustomizedLabel}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape as any}
                  >
                    {leadsBySource.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={sourceColors[index % sourceColors.length]}
                        className="transition-all duration-200 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, 'Leads']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend 
                    formatter={(value, entry) => (
                      <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Contratos por Plano</CardTitle>
            <CardDescription>Distribuição de contratos ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contractsByPlan}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="plan"
                    label={renderCustomizedLabel}
                    onMouseEnter={onPlanPieEnter}
                    onMouseLeave={onPlanPieLeave}
                    activeIndex={activePlanIndex}
                    activeShape={renderActiveShape as any}
                  >
                    {contractsByPlan.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={planColors[index % planColors.length]}
                        className="transition-all duration-200 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, 'Contratos']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend 
                    formatter={(value, entry) => (
                      <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}