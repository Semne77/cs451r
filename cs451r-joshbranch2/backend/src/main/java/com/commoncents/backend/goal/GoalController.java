package com.commoncents.backend.goal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "http://localhost:5173")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @GetMapping("/{userId}")
    public List<Goal> getGoalsByUserId(@PathVariable int userId) {
        return goalService.getGoalsByUserId(userId);
    }

    @PostMapping
    public Goal createGoal(@RequestBody Goal goal) {
        return goalService.saveGoal(goal);
    }

    @DeleteMapping("/{goalId}")
    public ResponseEntity<String> deleteGoal(@PathVariable int goalId) {
        goalService.deleteGoal(goalId);
        return ResponseEntity.ok("Goal deleted successfully.");
    }

    @PostMapping("/deleteMany")
    public ResponseEntity<String> deleteMany(@RequestBody List<Integer> goalIds) {
        goalService.deleteMany(goalIds);
        return ResponseEntity.ok("Goals deleted successfully.");
    }
}
