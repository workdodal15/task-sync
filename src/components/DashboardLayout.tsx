import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, Plus, Search as SearchIcon, X, Filter, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type PriorityFilter = 'all' | 'low' | 'medium' | 'high';
export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNewTask: () => void;
  onSearch: (query: string) => void;
  priorityFilter: PriorityFilter;
  onPriorityFilterChange: (value: PriorityFilter) => void;
  sortBy: SortBy;
  onSortByChange: (value: SortBy) => void;
  sortOrder: SortOrder;
  onSortOrderChange: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  onNewTask, 
  onSearch, 
  priorityFilter, 
  onPriorityFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange
}) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };
  
  if (!user) return null;
  
  const sortByOptions: { value: SortBy; label: string }[] = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary">TaskSync</h1>
            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
              Collab Hub
            </span>
          </div>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="w-full pl-8 bg-background pr-8 h-9"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button 
                  className="absolute right-2.5 top-2.5"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-4">
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="outline" size="sm" className="h-9">
                   <Filter className="h-4 w-4 mr-1" />
                   <span className="hidden sm:inline">Priority</span>
                   {priorityFilter !== 'all' && (
                      <Badge variant="secondary" className="ml-2 capitalize">{priorityFilter}</Badge>
                   )}
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                 <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuRadioGroup value={priorityFilter} onValueChange={(value) => onPriorityFilterChange(value as PriorityFilter)}>
                   <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                   <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
                   <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
                   <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
                 </DropdownMenuRadioGroup>
               </DropdownMenuContent>
             </DropdownMenu>

            <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortBy)}>
              <SelectTrigger className="w-[150px] h-9 text-sm" aria-label="Sort by">
                 <span className="hidden sm:inline">Sort by:</span> 
                 <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortByOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="capitalize">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9"
              onClick={onSortOrderChange}
              aria-label={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
            
            <Separator orientation="vertical" className="h-8 mx-2" />

            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56">
                 <DropdownMenuLabel className="font-normal">
                   <div className="flex flex-col space-y-1">
                     <p className="text-sm font-medium leading-none">{user.name}</p>
                     <p className="text-xs leading-none text-muted-foreground">
                       {user.email}
                     </p>
                   </div>
                 </DropdownMenuLabel>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={logout}>
                   <LogOut className="mr-2 h-4 w-4" />
                   <span>Log out</span>
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>

          </div>
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Task Dashboard</h2>
            <p className="text-muted-foreground">Drag and drop tasks to change their status.</p>
          </div>
          <Button onClick={onNewTask} className="bg-primary hover:bg-primary/90 shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
        
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
