package com.commoncents.backend.goal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    public List<Goal> getGoalsByUserId(int userId) {
        return goalRepository.findByUserId(userId);
    }

    public Goal saveGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public void deleteGoal(int goalId) {
        goalRepository.deleteById(goalId);
    }

    public void deleteMany(List<Integer> goalIds) {
        goalRepository.deleteAllById(goalIds);
    }
}
