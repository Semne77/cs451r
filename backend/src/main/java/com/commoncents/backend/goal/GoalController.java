package com.commoncents.backend.goal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping("/{userId}")
    public List<Goal> getGoalsByUserId(@PathVariable Long userId) {
        return goalService.getGoalsByUserId(userId);
    }

    @PostMapping
    public Goal createGoal(@RequestBody Goal goal) {
        return goalService.addGoal(goal);
    }

    @PutMapping("/{id}")
    public Goal updateGoal(@PathVariable Long id, @RequestBody Goal goalDetails) {
        Goal existing = goalService.getGoalsByUserId(goalDetails.getUserId())
                .stream()
                .filter(g -> g.getGoalId().equals(id))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setCategory(goalDetails.getCategory());
            existing.setGoalType(goalDetails.getGoalType());
            existing.setTargetAmount(goalDetails.getTargetAmount());
            existing.setStartDate(goalDetails.getStartDate());
            existing.setEndDate(goalDetails.getEndDate());
            existing.setPeriod(goalDetails.getPeriod());
            return goalService.saveGoal(existing);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
    }
}
